import {Star} from "./../../../../website/src/models/Star";
import { Document } from "mongodb";

export default interface StarDocument extends Star, Document {}