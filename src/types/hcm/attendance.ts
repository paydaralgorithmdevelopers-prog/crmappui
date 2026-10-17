export interface Location {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  radius: number;
  isActive: boolean;
}

export type AttendanceEventType = 'ENTRY' | 'EXIT';

export interface AttendanceStatus {
  employeeId: number;
  lastEventType: AttendanceEventType;
  lastEventTime: string;
  suggestedEventType: AttendanceEventType;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: string;
}

export interface VerificationSession {
  challengeId: string;
  expiresAt: string;
  livenessChallenge: 'TURN_RIGHT' | 'TURN_LEFT' | 'BLINK' | 'MOVE_CLOSER';
}

export interface QrPayload {
  gateId: string;
  token: string;
  issuedAt: string;
  expiresAt: string;
  qrPayload: string;
  refreshAfterSeconds: number;
}

export interface VerificationCompleteRequest {
  challengeId: string;
  employeeId: number;
  eventType: AttendanceEventType;
  qrPayload: string;
  location: LocationData;
  faceCapture: string; // Base64 or URL
  livenessData: any;
  deviceInfo: {
    userAgent: string;
    platform: string;
    deviceId: string;
  };
}

export interface VerificationResult {
  success: boolean;
  attendanceId?: number;
  eventType?: AttendanceEventType;
  eventTime?: string;
  locationName?: string;
  verification?: {
    qr: boolean;
    geo: boolean;
    face: boolean;
    liveness: boolean;
  };
  errorCode?: string;
}

export type AttendanceState = 
  | 'INITIAL'
  | 'GETTING_LOCATION'
  | 'STARTING_SESSION'
  | 'WAITING_FOR_CAMERA'
  | 'WAITING_FOR_QR'
  | 'WAITING_FOR_FACE'
  | 'LIVENESS_CHECK'
  | 'READY_TO_SUBMIT'
  | 'SUBMITTING'
  | 'SUCCESS'
  | 'REJECTED';
