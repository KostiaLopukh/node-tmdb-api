import bcrypt from 'bcrypt';

class PasswordService{
    public async hash(password:string){
        return bcrypt.hash(password, 10);
    }

    public async compare(password: string, hashedPassword: string) {
        return bcrypt.compare(password, hashedPassword);
    }

}

export const passwordService = new PasswordService();
