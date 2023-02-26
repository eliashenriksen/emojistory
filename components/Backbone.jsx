//Remember to remove console logs on cleanup
import data from '@emoji-mart/data';
import { init, SearchIndex } from 'emoji-mart';
import { useState } from "react";
import _ from 'lodash';
import axios from "axios";
import { DATAMUSE_BASE_URL } from "@/constants/api";

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
        async function findSimilarWord() {
          try {
            const response = await axios.get(DATAMUSE_BASE_URL + `/words?ml=${value}`);
            const data = response.data;

            async function deepSearch(value) {
              const emojis = await SearchIndex.search(value);
              const results = emojis.map((emoji) => {
                return emoji.skins[0].native
              })
              if (results.length > 0) {
                // console.log(results);
                const randomSingleEmojiFromArray = _.sample(results);
                console.log(randomSingleEmojiFromArray);
                search(randomSingleEmojiFromArray);
                return randomSingleEmojiFromArray;
              } else {
                // console.log("no matches");
                return "";
              }
            }

            for (let i = 0; i < data.length; i++) {
              console.log(data[i].word);
              const deepSearchResults = await deepSearch(data[i].word);
              if (deepSearchResults) {
                break;
              }
            }

          } catch (error) {
            console.log(error);
          }
        }
        findSimilarWord();
      }
    }
    //Add override for prepositions, pronouns etc. here (seperate override file import?).
    search(searchValue);
  }

  function generateStory(event) {
    event.preventDefault();
    setStoryOutputEmojis([]);

    const splitUpInputStory = storyInputValue.split(" ");
    const filteredStoryArray = splitUpInputStory.filter((string) => string !== "");
    console.log(filteredStoryArray);

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