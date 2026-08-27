/**
 * Placeholder for future admin API integration.
 * All admin actions remain local/mock in the current app version.
 */
export type AdminRepository = {
  restartDevice: (deviceId: string) => Promise<boolean>;
  updateFirmware: (deviceId: string) => Promise<boolean>;
  applyConfig: (deviceId: string, config: Record<string, string>) => Promise<boolean>;
};

export const mockAdminRepository: AdminRepository = {
  async restartDevice() {
    return true;
  },

  async updateFirmware() {
    return true;
  },

  async applyConfig() {
    return true;
  },
};

export const adminRepository: AdminRepository = mockAdminRepository;
