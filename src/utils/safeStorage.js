const getBackupKey = (key) => `${key}__backup`;

export const readJson = (key, fallback) => {
  let rawValue;
  try {
    rawValue = localStorage.getItem(key);
  } catch (error) {
    return fallback;
  }

  if (rawValue) {
    try {
      return JSON.parse(rawValue);
    } catch (error) {
      let backupValue;
      try {
        backupValue = localStorage.getItem(getBackupKey(key));
      } catch (backupReadError) {
        return fallback;
      }
      if (backupValue) {
        try {
          const parsedBackup = JSON.parse(backupValue);
          try {
            localStorage.setItem(key, backupValue);
          } catch (restoreError) {
            // The backup is still returned even when restoration is blocked.
          }
          return parsedBackup;
        } catch (backupError) {
          return fallback;
        }
      }
    }
  }

  return fallback;
};

export const writeJson = (key, value) => {
  const serializedValue = JSON.stringify(value);
  let currentValue;
  try {
    currentValue = localStorage.getItem(key);
  } catch (error) {
    throw new Error('Storage is not available');
  }

  if (currentValue) {
    try {
      localStorage.setItem(getBackupKey(key), currentValue);
    } catch (error) {
      throw new Error('Storage backup could not be written');
    }
  }

  try {
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    throw new Error('Storage could not be written');
  }
};
