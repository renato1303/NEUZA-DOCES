import { db } from './index.ts';
import { users, authorizedAdmins } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string, name?: string) {
  try {
    const result = await db
      .insert(users)
      .values({
        uid,
        email,
        name: name || null,
        role: 'admin',
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          name: name || null,
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Error in getOrCreateUser:', error);
    throw new Error('Database user sync failed.', { cause: error });
  }
}

export async function isAuthorizedAdmin(email: string): Promise<boolean> {
  try {
    const cleanEmail = email.toLowerCase().trim();
    const records = await db
      .select()
      .from(authorizedAdmins)
      .where(eq(authorizedAdmins.email, cleanEmail));

    if (records.length > 0 && records[0].active) {
      return true;
    }
    
    // Default authorized admins and company domain
    if (
      cleanEmail === 'renatoinacio2@gmail.com' ||
      cleanEmail === 'admin@neuzadoces.com.br' ||
      cleanEmail.endsWith('@neuzadoces.com.br')
    ) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error checking authorized admin:', error);
    const cleanEmail = email.toLowerCase().trim();
    return (
      cleanEmail === 'renatoinacio2@gmail.com' ||
      cleanEmail === 'admin@neuzadoces.com.br' ||
      cleanEmail.endsWith('@neuzadoces.com.br')
    );
  }
}

export async function getAdminByEmail(email: string) {
  try {
    const cleanEmail = email.toLowerCase().trim();
    const records = await db
      .select()
      .from(authorizedAdmins)
      .where(eq(authorizedAdmins.email, cleanEmail));

    if (records.length > 0) {
      return records[0];
    }
    return null;
  } catch (error) {
    console.error('Error fetching admin by email:', error);
    return null;
  }
}

export async function getAuthorizedAdminsList() {
  try {
    return await db.select().from(authorizedAdmins);
  } catch (error) {
    console.error('Error listing admins:', error);
    return [];
  }
}
