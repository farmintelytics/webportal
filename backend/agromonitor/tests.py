import json
from django.test import TestCase, Client

class ApiEndpointsTestCase(TestCase):
    def setUp(self):
        self.client = Client()

    def test_auth_login(self):
        # Test valid credentials
        response = self.client.post(
            '/farmintelytics-engine/agromonitoring/auth/login',
            data=json.dumps({"email": "admin@farmintelytics.com", "access_code": "admin123"}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "success")
        self.assertIn("token", data)

        # Test invalid credentials
        response_fail = self.client.post(
            '/farmintelytics-engine/agromonitoring/auth/login',
            data=json.dumps({"email": "wrong@example.com", "access_code": "wrong"}),
            content_type='application/json'
        )
        self.assertEqual(response_fail.status_code, 200)
        self.assertEqual(response_fail.json()["status"], "error")

    def test_dashboard_endpoints(self):
        # Stats
        r_stats = self.client.get('/farmintelytics-engine/agromonitoring/dashboard/stats')
        self.assertEqual(r_stats.status_code, 200)
        self.assertIn("total_area_ha", r_stats.json())

        # Trends
        r_trends = self.client.get('/farmintelytics-engine/agromonitoring/dashboard/trends')
        self.assertEqual(r_trends.status_code, 200)
        self.assertIn("ndvi_vigor_trends", r_trends.json())

    def test_plots_endpoints(self):
        # Intelligence
        r_intel = self.client.get('/farmintelytics-engine/agromonitoring/plots/intelligence/')
        self.assertEqual(r_intel.status_code, 200)
        self.assertTrue(len(r_intel.json()) > 0)

        # Health
        r_health = self.client.get('/farmintelytics-engine/agromonitoring/plots/health/')
        self.assertEqual(r_health.status_code, 200)

        # Yield
        r_yield = self.client.get('/farmintelytics-engine/agromonitoring/plots/yield/forecast/')
        self.assertEqual(r_yield.status_code, 200)

        # Telemetry
        r_telemetry = self.client.get('/farmintelytics-engine/agromonitoring/plots/telemetry/')
        self.assertEqual(r_telemetry.status_code, 200)

    def test_restoration(self):
        response = self.client.get('/farmintelytics-engine/agromonitoring/restoration/zones/')
        self.assertEqual(response.status_code, 200)

    def test_alerts(self):
        # Fetch alerts
        response = self.client.get('/farmintelytics-engine/agromonitoring/alerts/')
        self.assertEqual(response.status_code, 200)
        self.assertIn("feed", response.json())

        # Acknowledge ALT-001
        response_ack = self.client.post('/farmintelytics-engine/agromonitoring/alerts/ALT-001/acknowledge')
        self.assertEqual(response_ack.status_code, 200)
        self.assertEqual(response_ack.json()["status"], "success")

    def test_verification(self):
        response = self.client.get('/farmintelytics-engine/agromonitoring/verification/audit?plot_id=PLOT-ALPHA')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["overall_compliance"])

    def test_reports(self):
        # Certificate post
        response = self.client.post(
            '/farmintelytics-engine/agromonitoring/reports/certificate',
            data=json.dumps({"scope": "Plot-Level", "metric": "NDVI", "plot_id": "PLOT-ALPHA"}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("hash", response.json())

        # Reports list
        response_list = self.client.get('/farmintelytics-engine/agromonitoring/reports/list')
        self.assertEqual(response_list.status_code, 200)

    def test_chat(self):
        response = self.client.post(
            '/farmintelytics-engine/agromonitoring/chat/ask',
            data=json.dumps({"message": "Tell me about carbon credits", "scenario": "Carbon Registry"}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("response", response.json())
