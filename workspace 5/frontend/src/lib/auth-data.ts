export type DemoProfile = {
  name: string;
  email: string;
  isDemoUser: true;
  registered: true;
};

const PROFILE_KEY = 'applicant-notebook:demo-profile:v1';
const SESSION_KEY = 'applicant-notebook:demo-session:v1';

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function safeRead<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function safeWrite<T>(key: string, value: T) {
  if (!isBrowser()) return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Browser storage may be unavailable in a restricted environment.
  }
}

function safeRemove(key: string) {
  if (!isBrowser()) return;

  try {
    window.localStorage.removeItem(key);
  } catch {
    // Browser storage may be unavailable in a restricted environment.
  }
}

function normalizeProfile(value: unknown): DemoProfile | null {
  if (!value || typeof value !== 'object') return null;

  const source = value as Partial<DemoProfile>;
  if (typeof source.name !== 'string' || !source.name.trim()) return null;
  if (typeof source.email !== 'string' || !source.email.trim()) return null;
  if (source.isDemoUser !== true || source.registered !== true) return null;

  return {
    name: source.name.trim(),
    email: source.email.trim().toLowerCase(),
    isDemoUser: true,
    registered: true,
  };
}

export function loadDemoProfile() {
  return normalizeProfile(safeRead<unknown>(PROFILE_KEY, null));
}

export function hasDemoProfile() {
  return loadDemoProfile() !== null;
}

export function saveDemoProfile(input: Pick<DemoProfile, 'name' | 'email'>) {
  const profile: DemoProfile = {
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    isDemoUser: true,
    registered: true,
  };

  safeWrite(PROFILE_KEY, profile);
  return profile;
}

export function loadDemoSession() {
  return safeRead<unknown>(SESSION_KEY, false) === true && loadDemoProfile() !== null;
}

export function startDemoSession() {
  if (!loadDemoProfile()) return false;
  safeWrite(SESSION_KEY, true);
  return true;
}

export function endDemoSession() {
  safeRemove(SESSION_KEY);
}
