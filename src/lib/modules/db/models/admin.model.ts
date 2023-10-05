//@ts-check
//User Schema
import { Schema, model } from 'mongoose';
import AdminModelInterface from '../../../../types/interfaces/modules/db/models/Iadmin.model';
import AdminInterface from '../../../../types/interfaces/response/admin.response';
import { defaultLogger } from '../../logger';

const UserSchema = new Schema<AdminInterface>({
  name: {
    type: String,
    required: [true, 'name is required'],
  },
  emailAddress: {
    type: String,
    required: [true, 'email is required'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'password is required']
  },
  updatedAt: {
    type: Date,
    default: new Date()
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  accessToken: {
    type: String
  },
  authenticationCode: {
    type: Number,
  },
  isVerified: {
    type: Boolean,
    default: false
  },
});

export const Store = model("Admin", UserSchema)

class  AdminModel implements  AdminModelInterface {
  Store: typeof Store;

    constructor() {
        this.Store =  Store;
    }

    saveAdminToDB = async (details: AdminInterface) => {
        try {
            const data = await this.Store.create(details);
            if (data) {
              return {status: true, data};
            } else {
              return {status: false, error: "Couldn't create user"};
            }
        } catch (error) {
            defaultLogger.error(error);
            return {status: false, error };
        }
    }

    updateAdminDetailToDB = async (id : string, details : Partial<AdminInterface>) => {
        try {
            const data = await this.Store.findByIdAndUpdate(id, details, {new: true});
            if (data) {
              return {status: true, data};
            } else {
              return {status: false, error: "Couldn't update user"};
            }
        } catch (error) {
            defaultLogger.error(error);
            return {status: false, error };
        }
    }

    checkIfExist = async (details : Partial<AdminInterface>) => {
        try {
            const data = await this.Store.findOne(details);
            if (data) {
                return {status: true, data};
            }else {
                return {status: false, error: `Can't find Details`};
            }
        } catch (error) {
            defaultLogger.error(error);
            return {status: false, error }
        }
    }

    deleteAdminFromDb = async (details : Partial<AdminInterface>) => {
        try {
            const data = await this.Store.findOneAndDelete(details);
            if (data) {
                return {status: true, data};
            }else {
                return {status: false, error: `Can't find Details`};
            }
        } catch (error) {
            defaultLogger.error(error);
            return {status: false, error }
        }
    }
}

export default AdminModel;
