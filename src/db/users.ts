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
      cleanEmail === 'master' ||
      cleanEmail === 'master@neuzadoces.com.br' ||
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
      cleanEmail === 'master' ||
      cleanEmail === 'master@neuzadoces.com.br' ||
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

export async function createAdminUser(email: string, name: string) {
  try {
    const cleanEmail = email.toLowerCase().trim();
    await db
      .insert(authorizedAdmins)
      .values({
        email: cleanEmail,
        name: name.trim(),
        role: 'admin',
        active: true,
      })
      .onConflictDoUpdate({
        target: authorizedAdmins.email,
        set: {
          name: name.trim(),
          active: true,
        },
      });

    const uid = `user-${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
    return await getOrCreateUser(uid, cleanEmail, name.trim());
  } catch (error) {
    console.error('Error in createAdminUser:', error);
    throw new Error('Falha ao cadastrar usuário administrador no banco de dados.', { cause: error });
  }
}

export async function deleteAdminUser(id: number) {
  try {
    await db.delete(authorizedAdmins).where(eq(authorizedAdmins.id, id));
  } catch (error) {
    console.error('Error in deleteAdminUser:', error);
    throw new Error('Falha ao excluir usuário administrador.', { cause: error });
  }
}
