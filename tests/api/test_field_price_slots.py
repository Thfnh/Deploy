"""T123-178 regression for time-scoped price protection."""
import sys
import unittest
from datetime import time
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import MagicMock, patch

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "backend"))
from services import field_management_service as fields


class FieldPriceSlotTests(unittest.TestCase):
    def setUp(self):
        self.cursor = MagicMock()
        self.data = {"StartTime": "06:00", "EndTime": "07:00", "Price": 300000}
        field = patch.object(fields, "get_field", return_value=SimpleNamespace(IsArchived=False))
        details = patch.object(fields, "get_field_details", return_value={})
        field.start()
        details.start()
        self.addCleanup(field.stop)
        self.addCleanup(details.stop)

    def test_add_checks_only_requested_window_and_active_statuses(self):
        self.cursor.fetchone.side_effect = [(0,), (0,), (8,)]
        self.assertEqual(fields.add_field_price(self.cursor, 1, self.data)["PriceID"], 8)
        booking_check = self.cursor.execute.call_args_list[1].args
        self.assertIn("IN ('PENDING', 'CONFIRMED')", booking_check[0])
        self.assertNotIn("'CANCELLED'", booking_check[0])
        self.assertIn("AND StartTime < ? AND EndTime > ?", booking_check[0])
        self.assertEqual(booking_check[1:], (1, time(7), time(6)))
        self.assertIn("INSERT INTO dbo.FieldPrices", self.cursor.execute.call_args.args[0])

    def test_add_rejects_overlapping_price_or_active_booking(self):
        for rows, code in (
            ([(1,)], "PRICE_SLOT_OVERLAP"),
            ([(0,), (1,)], "PRICE_SLOT_ACTIVE_BOOKINGS"),
        ):
            with self.subTest(code=code):
                self.cursor.reset_mock()
                self.cursor.fetchone.side_effect = rows
                with self.assertRaises(fields.FieldManagementError) as error:
                    fields.add_field_price(self.cursor, 1, self.data)
                self.assertEqual(error.exception.code, code)
                self.assertFalse(any("INSERT" in call.args[0] for call in self.cursor.execute.call_args_list))

    def test_edit_rejects_active_booking_in_old_or_new_window(self):
        current = SimpleNamespace(StartTime=time(16), EndTime=time(18))
        for counts, window in (
            ([(1,)], (1, time(18), time(16))),
            ([(0,), (1,)], (1, time(7), time(6))),
        ):
            with self.subTest(window=window):
                self.cursor.reset_mock()
                self.cursor.fetchone.side_effect = [current, (0,), *counts]
                with self.assertRaises(fields.FieldManagementError) as error:
                    fields.update_field_price(self.cursor, 1, 3, self.data)
                self.assertEqual(error.exception.code, "PRICE_SLOT_ACTIVE_BOOKINGS")
                self.assertEqual(self.cursor.execute.call_args.args[1:], window)

    def test_edit_keeps_booking_and_payment_data_untouched(self):
        current = SimpleNamespace(StartTime=time(6), EndTime=time(7))
        self.cursor.fetchone.side_effect = [current, (0,), (0,)]
        fields.update_field_price(self.cursor, 1, 3, self.data)
        self.assertIn("UPDATE dbo.FieldPrices", self.cursor.execute.call_args.args[0])
        self.assertEqual(len(self.cursor.execute.call_args_list), 4)
