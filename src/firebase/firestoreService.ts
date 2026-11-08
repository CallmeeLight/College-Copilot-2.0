import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  getDocs, 
  writeBatch 
} from "firebase/firestore";
import { db, auth } from "./firebaseConfig";
import { Assignment, NoteItem, ScheduleEvent, AttendanceRecord, StudentAcademicProfile } from "../types";

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.warn("Firestore Operation Notice:", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Subscribe to User's Assignments in Firestore
export function subscribeAssignments(
  userId: string,
  onUpdate: (assignments: Assignment[]) => void,
  onError?: (err: Error) => void
) {
  const path = `users/${userId}/assignments`;
  const colRef = collection(db, "users", userId, "assignments");
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: Assignment[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as Assignment);
      });
      onUpdate(list);
    },
    (err) => {
      console.warn("Assignments sync subscription notice:", err.message);
      onError?.(err);
      try {
        handleFirestoreError(err, OperationType.LIST, path);
      } catch {
        // Handled via callback
      }
    }
  );
}

// Save or update an Assignment
export async function syncAssignment(userId: string, assignment: Assignment) {
  const path = `users/${userId}/assignments/${assignment.id}`;
  try {
    const docRef = doc(db, "users", userId, "assignments", assignment.id);
    await setDoc(docRef, {
      ...assignment,
      userId,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// Subscribe to User's Notes in Firestore
export function subscribeNotes(
  userId: string,
  onUpdate: (notes: NoteItem[]) => void,
  onError?: (err: Error) => void
) {
  const path = `users/${userId}/notes`;
  const colRef = collection(db, "users", userId, "notes");
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: NoteItem[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as NoteItem);
      });
      onUpdate(list);
    },
    (err) => {
      console.warn("Notes sync subscription notice:", err.message);
      onError?.(err);
      try {
        handleFirestoreError(err, OperationType.LIST, path);
      } catch {
        // Handled via callback
      }
    }
  );
}

// Save or update a Note
export async function syncNote(userId: string, note: NoteItem) {
  const path = `users/${userId}/notes/${note.id}`;
  try {
    const docRef = doc(db, "users", userId, "notes", note.id);
    await setDoc(docRef, {
      ...note,
      userId,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// Subscribe to Schedule Events
export function subscribeSchedule(
  userId: string,
  onUpdate: (events: ScheduleEvent[]) => void,
  onError?: (err: Error) => void
) {
  const path = `users/${userId}/schedule`;
  const colRef = collection(db, "users", userId, "schedule");
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: ScheduleEvent[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as ScheduleEvent);
      });
      onUpdate(list);
    },
    (err) => {
      console.warn("Schedule sync subscription notice:", err.message);
      onError?.(err);
      try {
        handleFirestoreError(err, OperationType.LIST, path);
      } catch {
        // Handled via callback
      }
    }
  );
}

// Save or update Schedule Event
export async function syncScheduleEvent(userId: string, event: ScheduleEvent) {
  const path = `users/${userId}/schedule/${event.id}`;
  try {
    const docRef = doc(db, "users", userId, "schedule", event.id);
    await setDoc(docRef, {
      ...event,
      userId,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// Subscribe to Attendance Records
export function subscribeAttendance(
  userId: string,
  onUpdate: (records: AttendanceRecord[]) => void,
  onError?: (err: Error) => void
) {
  const path = `users/${userId}/attendance`;
  const colRef = collection(db, "users", userId, "attendance");
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: AttendanceRecord[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as AttendanceRecord);
      });
      onUpdate(list);
    },
    (err) => {
      console.warn("Attendance sync subscription notice:", err.message);
      onError?.(err);
      try {
        handleFirestoreError(err, OperationType.LIST, path);
      } catch {
        // Handled via callback
      }
    }
  );
}

// Save or update Attendance Record
export async function syncAttendanceRecord(userId: string, record: AttendanceRecord) {
  const path = `users/${userId}/attendance/${record.id}`;
  try {
    const docRef = doc(db, "users", userId, "attendance", record.id);
    await setDoc(docRef, {
      ...record,
      userId,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// Seed user database on first login if empty
export async function seedUserDataIfEmpty(
  userId: string,
  defaults: {
    assignments: Assignment[];
    notes: NoteItem[];
    schedule: ScheduleEvent[];
    attendance: AttendanceRecord[];
  }
) {
  try {
    const assignCol = collection(db, "users", userId, "assignments");
    const existingAssign = await getDocs(assignCol);

    if (existingAssign.empty) {
      const batch = writeBatch(db);

      // Seed assignments
      defaults.assignments.forEach((item) => {
        const ref = doc(db, "users", userId, "assignments", item.id);
        batch.set(ref, { ...item, userId });
      });

      // Seed notes
      defaults.notes.forEach((item) => {
        const ref = doc(db, "users", userId, "notes", item.id);
        batch.set(ref, { ...item, userId });
      });

      // Seed schedule
      defaults.schedule.forEach((item) => {
        const ref = doc(db, "users", userId, "schedule", item.id);
        batch.set(ref, { ...item, userId });
      });

      // Seed attendance
      defaults.attendance.forEach((item) => {
        const ref = doc(db, "users", userId, "attendance", item.id);
        batch.set(ref, { ...item, userId });
      });

      await batch.commit();
      console.info("Successfully seeded student default data to Firestore for user:", userId);
    }
  } catch (err) {
    console.warn("Note: Data seeding skipped or deferred:", err);
  }
}

// Sync Student Academic Profile to Firestore
export async function syncAcademicProfile(userId: string, profile: StudentAcademicProfile) {
  const path = `users/${userId}`;
  try {
    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, {
      academicProfile: profile,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// Fetch Student Academic Profile from Firestore
export async function fetchAcademicProfile(userId: string): Promise<StudentAcademicProfile | null> {
  const path = `users/${userId}`;
  try {
    const userDocRef = doc(db, "users", userId);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data?.academicProfile) {
        return data.academicProfile as StudentAcademicProfile;
      }
    }
    return null;
  } catch (err) {
    console.warn("Academic profile fetch notice:", err);
    try {
      handleFirestoreError(err, OperationType.GET, path);
    } catch {
      // Return null on read failure so local profile remains active
    }
    return null;
  }
}
