//Remember to remove console logs on cleanup
import data from '@emoji-mart/data';
import { init, SearchIndex } from 'emoji-mart';
import { useState } from "react";
import _ from 'lodash';
import axios from "axios";
import { DATAMUSE_BASE_URL } from "@/constants/api";
import useWordOverride from "../hooks/useWordOverride";

export default function Backbone() {

  const [storyInputValue, setStoryInputValue] = useState("");
  const [storyOutputEmojis, setStoryOutputEmojis] = useState([]);


  function findMatchingEmoji(searchValue) {
    init({ data });
    async function search(value) {
      const emojis = await SearchIndex.search(value);
      const results = emojis.map((emoji) => {
        return emoji.skins[0].native
      })

      //If results length is greater than 0 that means atleast 1 emoji was found for the input word (if more than 1 emoji was found, we randomly pick 1 with the help of lodash sample).
      //If results length is 0 then no emojis were found and we call the similar word API to try again with a different word. Repeat untill we can find an emoji.
      if (results.length > 0) {
        const randomSingleEmojiFromArray = _.sample(results);
        console.log(randomSingleEmojiFromArray);
        console.log(results);

        //https://stackoverflow.com/questions/67309672/how-to-prevent-react-state-overwrites-due-to-asynchronous-code-and-websocket-rac
        setStoryOutputEmojis(prevState => [...prevState, randomSingleEmojiFromArray]);
      } else {

        //Core function to find a matching similar word to the one put in, that has a co-responsind emoji representation.
        //This is needed due to the fact that theres only so many keywords you can match to emojis manually out of the thousands of words in the english language.
        //The logic is as follows. If a user puts in a word that is not already a keyword that matches a specific emoji, then we run the word that the user has put in
        //through a similar words API untill we find a word that has a matching emoji.
        async function findSimilarWord() {
          try {
            //First we get a list of all matching words to the one that was put in.
            const response = await axios.get(DATAMUSE_BASE_URL + `/words?ml=${value}`);
            const data = response.data;


            //We loop over the datamuse API similar words results and run each result word through our deepsearch function. We are looking for the first match.
            //If the return from the function is an emoji, then we have suceeded and we break the loop in the if statement.
            //If the return is false (no matching emoji found for that word), we continue the search untill we get the first match.
            //There is some randomness added when it comes to the similar words API, so that we dont always get the exact same emoji.
            //There is a 45% chance to skip over a word when looking for a match.
            for (let i = 0; i < data.length; i++) {
              const chanceToSkipWord = Math.random();
              if (chanceToSkipWord < 0.45) {
                console.log("data[i].word here >", data[i].word);
                const deepSearchResults = await deepSearch(data[i].word);
                if (deepSearchResults) {
                  break;
                }
              } else {
                continue;
              }

              // console.log("data[i].word here >", data[i].word);
              // const deepSearchResults = await deepSearch(data[i].word);
              // console.log("deepsearchresults", deepSearchResults);
              // if (deepSearchResults) {
              //   break;
              // }
            }

            //The deepSearch function as described above. This is an edited copy of the same emoji search function that is used further above to find emojis.
            async function deepSearch(value) {
              const emojis = await SearchIndex.search(value);
              const results = emojis.map((emoji) => {
                return emoji.skins[0].native
              })
              if (results.length > 0) {
                console.log("all deepsearch results", results);
                const randomSingleEmojiFromArray = _.sample(results);
                console.log("random emoji from deepsearch", randomSingleEmojiFromArray);
                search(randomSingleEmojiFromArray);
                return randomSingleEmojiFromArray;
              } else {
                // console.log("no matches");
                return false;
              }
            }

          } catch (error) {
            console.log(error);
          }
        }
        findSimilarWord();
      }
    }

    //Some overrides are required for certain words that build up sentences.
    //Before running the input search value through the emoji search function, we first run the value through the word override function to see if the value includes
    //specific words that need to be overridden to certain emojis.
    search(useWordOverride(searchValue));
  }

  function generateStory(event) {
    event.preventDefault();
    setStoryOutputEmojis([]);

    const splitUpInputStory = storyInputValue.split(" ");
    console.log("storyinputvalue >", storyInputValue);
    console.log("splitupinputstory >", splitUpInputStory);

    //Filtering out empty strings.
    //Also remove strings containing the word "the". If more words need to be ommited in the future, add them here.
    //If a lot of words need to be ommited in the future add some better way to solve that here like with the word overrides.
    const filteredStoryArray = splitUpInputStory.filter((string) => string !== "" && string !== "the" && string !== "just");
    console.log("filteredstoryarray >", filteredStoryArray);

    for (let i = 0; i < filteredStoryArray.length; i++) {
      findMatchingEmoji(filteredStoryArray[i]);
    }

  }

  return(
    <>
      <div>{storyOutputEmojis}</div>
      <form onSubmit={generateStory}>
        <input onChange={(e) => setStoryInputValue(e.target.value)} type="text" id="storyinput" name="storyinput"></input>
        <button>Go!</button>
      </form>
    </>
  )
}