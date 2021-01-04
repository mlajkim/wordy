import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const permissionSchema = new Schema({
  permissionCode: String,
  playerID: String,
  nickName: String,
});

export default mongoose.model('permissions', permissionSchema); 