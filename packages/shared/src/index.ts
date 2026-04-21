import { z } from 'zod';

export const userRoleSchema = z.enum(['ADMIN', 'OPERATOR', 'SUPPORT', 'CUSTOMER']);

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const bootstrapAdminSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  displayName: z.string().min(2)
});

export const userCreateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  displayName: z.string().min(2),
  role: userRoleSchema
});

export const customerSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  companyName: z.string().optional().nullable(),
  taxId: z.string().optional().nullable(),
  addressLine1: z.string().optional().nullable(),
  addressLine2: z.string().optional().nullable(),
  district: z.string().optional().nullable(),
  province: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
  country: z.string().optional().nullable()
});

export const domainSchema = z.object({
  customerId: z.string().min(1),
  rootDomain: z.string().min(1),
  subdomain: z.string().optional().nullable(),
  dnsProvider: z.string().optional().nullable(),
  bindZoneName: z.string().optional().nullable(),
  nginxServerName: z.string().optional().nullable(),
  sslStatus: z.string().optional().nullable(),
  isPrimary: z.boolean().default(false)
});

export const appPackageSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  category: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  version: z.string().min(1),
  dockerImage: z.string().optional().nullable(),
  defaultPort: z.number().int().positive().optional().nullable(),
  installMode: z.string().optional().nullable(),
  templatePath: z.string().optional().nullable(),
  envSchema: z.record(z.any()).optional(),
  isActive: z.boolean().default(true)
});

export type CreateCustomerInput = z.infer<typeof customerSchema>;
export type CreateDomainInput = z.infer<typeof domainSchema>;
export type CreateAppPackageInput = z.infer<typeof appPackageSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type BootstrapAdminInput = z.infer<typeof bootstrapAdminSchema>;
export type CreateUserInput = z.infer<typeof userCreateSchema>;
