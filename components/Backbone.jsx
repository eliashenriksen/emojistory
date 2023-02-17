import data from '@emoji-mart/data';
import { init, SearchIndex } from 'emoji-mart';
import { useEffect, useState } from "react";
import _ from 'lodash';
import { useRouter } from "next/router";

export default function Backbone() {

  const [storyInputValue, setStoryInputValue] = useState("");
  const router = useRouter();


  function findMatchingEmoji(searchValue) {
    init({ data });
    async function search(value) {
      const emojis = await SearchIndex.search(value);
      const results = emojis.map((emoji) => {
        return emoji.skins[0].native
      })

      //if results length 0 fetch word api similar words and test those, select first match
      if (results.length > 0) {
        const randomSingleResult = _.sample(results);
        console.log(randomSingleResult);
        console.log(results);

        let storyOutputEmojis = [];
        if(sessionStorage.getItem("emojiArray")) {
          storyOutputEmojis = JSON.parse(sessionStorage.getItem("emojiArray"));
        }
        storyOutputEmojis.push(randomSingleResult);
        sessionStorage.setItem("emojiArray", JSON.stringify(storyOutputEmojis));
      }

    }

    search(searchValue);
  }

  function generateStory(event) {
    event.preventDefault();

    const splitUpInputStory = storyInputValue.split(" ");
    const filteredStoryArray = splitUpInputStory.filter((string) => string !== "");
    console.log(filteredStoryArray);

    for (let i = 0; i < filteredStoryArray.length; i++) {
      findMatchingEmoji(filteredStoryArray[i]);
    }

    router.push("/result");
  }


  return(
    <>
      <form onSubmit={generateStory}>
        <input onChange={(e) => setStoryInputValue(e.target.value)} type="text" id="storyinput" name="storyinput"></input>
        <button>Go!</button>
      </form>
    </>
  )
}