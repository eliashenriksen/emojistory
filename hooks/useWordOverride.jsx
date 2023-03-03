import { overrides } from "@/public/overrides";
import _, { over } from 'lodash';

export default function useWordOverride(wordToCheck) {

  let returnEmojiHolder = "";

  switch (wordToCheck) {
//Prepositions
    //fall throughs
    case "in":
    case "at":
    case "by":
    case "beside":
    case "across":
    case "through":
    case "to":
    case "into":
    case "towards":
    case "since":
    case "for":
    case "past":
    case "till":
    case "untill":
    case "there":
      returnEmojiHolder = _.sample(overrides.in);
      break;

    //fall throughs
    case "under":
    case "below":
    case "here":
      returnEmojiHolder = _.sample(overrides.under);
      break;

    //fall throughs
    case "on":
    case "over":
    case "above":
    case "onto":
      returnEmojiHolder = _.sample(overrides.on);
      break;

    //fall throughs
    case "ago":
    case "from":
    case "before":
      returnEmojiHolder = _.sample(overrides.from);
      break

//Verbs
    case "going":
      returnEmojiHolder = _.sample(overrides.going);
      break

    case "driving":
      returnEmojiHolder = _.sample(overrides.driving);
      break

    case "flying":
      returnEmojiHolder = _.sample(overrides.flying);
      break

    case "riding":
      returnEmojiHolder = _.sample(overrides.riding);
      break

    case "are":
      returnEmojiHolder = _.sample(overrides.are);
      break

//Conjunctions
    case "and":
      returnEmojiHolder = _.sample(overrides.and);
      break

//Pronouns
    case "i":
      returnEmojiHolder = _.sample(overrides.i);
      break
    
    case "we":
      returnEmojiHolder = _.sample(overrides.we);
      break

//Default Return
    default:
      return wordToCheck;
  }

  return returnEmojiHolder;
}