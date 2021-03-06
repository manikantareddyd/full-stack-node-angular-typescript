import * as mongoose from 'mongoose';
import { IHero } from './models.d'

let heroSchema = new mongoose.Schema({
    id: String,
    name: String
});

let Heroes = mongoose.model<IHero>("heroes", heroSchema);
export default Heroes;