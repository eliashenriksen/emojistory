import data from '@emoji-mart/data';
import { init, SearchIndex } from 'emoji-mart';
import { useEffect, useState } from "react";
import _ from 'lodash';

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

      //if results length 0 fetch word api similar words and test those, select first match
      if (results.length > 0) {
        const randomSingleEmojiFromArray = _.sample(results);
        console.log(randomSingleEmojiFromArray);
        console.log(results);

        //https://stackoverflow.com/questions/67309672/how-to-prevent-react-state-overwrites-due-to-asynchronous-code-and-websocket-rac
        setStoryOutputEmojis(prevState => [...prevState, randomSingleEmojiFromArray]);
      }
    }
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