import { AttendanceStatus, VerificationResult, VerificationCompleteRequest, VerificationSession, QrPayload } from '../../types/hcm/attendance';

class AttendanceService {
  async getCurrentStatus(): Promise<AttendanceStatus> {
    // GET /api/attendance/current-status
    return {
      employeeId: 1025,
      lastEventType: 'ENTRY',
      lastEventTime: new Date().toISOString(),
      suggestedEventType: 'EXIT'
    };
  }

  async getGateQr(gateId: string): Promise<QrPayload> {
    // GET /api/attendance/gates/{gateId}/qr
    return {
      gateId,
      token: Math.random().toString(36).substring(7),
      issuedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30000).toISOString(),
      qrPayload: JSON.stringify({
        gateId,
        token: 'random-token',
        issuedAt: Date.now(),
        expiresAt: Date.now() + 30000,
        nonce: 'a72f...',
        signature: '...'
      }),
      refreshAfterSeconds: 30
    };
  }
}

export const attendanceService = new AttendanceService();

class LocationService {
  async getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
    });
  }
}

export const locationService = new LocationService();

class VerificationService {
  async startVerification(): Promise<VerificationSession> {
    // POST /api/attendance/verification/start
    return {
      challengeId: crypto.randomUUID(),
      expiresAt: new Date(Date.now() + 120000).toISOString(),
      livenessChallenge: 'TURN_RIGHT'
    };
  }

  async completeVerification(data: VerificationCompleteRequest): Promise<VerificationResult> {
    // POST /api/attendance/verification/complete
    console.log('Completing verification with data:', data);
    return {
      success: true,
      attendanceId: 85412,
      eventType: data.eventType,
      eventTime: new Date().toISOString(),
      locationName: 'دفتر مرکزی',
      verification: {
        qr: true,
        geo: true,
        face: true,
        liveness: true
      }
    };
  }
}

export const verificationService = new VerificationService();
