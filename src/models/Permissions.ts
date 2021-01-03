import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const permissionSchema = new Schema({
  permissionCode: String,
  userID: String,
  nickName: String,
});

export default mongoose.model('permissions', permissionSchema); 