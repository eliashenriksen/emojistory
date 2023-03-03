import { overrides } from "@/public/overrides";
import _ from 'lodash';

//Prepositions> in,at,on, by, beside, under, below, over, above, across, through, to, into, towards, onto, from, since, for, ago, before, past, till, untill
//Similars> (in,at,by,beside,across,through,to,into,towards,since,for,past,till,untill)(under,below)(on,over,above,onto)(from,before)

export default function useWordOverride(wordToCheck) {

  let returnEmojiHolder = "";

  switch (wordToCheck) {
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
      returnEmojiHolder = _.sample(overrides.in);
      break;

    //fall throughs
    case "under":
    case "below":
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

    default:
      return wordToCheck;
  }

  return returnEmojiHolder;
}