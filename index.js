//given a name
//a list of banned words
//precompute variants of the bad words

/*
  Thoughts: This is two problems:
    1. Create permutations of the bad words given the map of changeable characters
    2. Search through the tries given a string
*/

const bad_words = ['bob', 'fool', 'silly', 'fork']

const substitutions = {
  'o': ['0'],
  'l': ['1', '|'],
  'i': ['1', '!'],
  's': ['$', '5'],
  'r': ['4'],
}

class TrieNode {
  constructor(value) {
    this.value = value;
    this.children = [];
  }
  
  addChild(value) {
    const newNode = new TrieNode(value)
    this.children.push(newNode)
    return newNode;
  }
}


class Trie {
  constructor(parentValue) {
    this.node = new TrieNode(parentValue)
  }

  getHead() {
    return this.node;
  }

  matches(str) {
    let currentCharIndex = 0;
    let queue = [this.node];
    let nextQueue = [];

    //while we haven't exhausted the string
    while(currentCharIndex < str.length) {

      //check all nodes at this depth for matches
      for(currentNode of queue) {
        let currentChar = str[currentCharIndex];

        if(currentNode.value === currentChar) {
          //are we at an end/leaf?
          if(currentNode.children.length < 1) {
            return true;
          }

          //add children for the next depth to check
          nextQueue = [...nextQueue, ...currentNode.children]
        }
      }

      //move to the next character in the string
      currentCharIndex +=1;

      //if we didn't have any matches at this depth, stop looping
      if(nextQueue.length < 1) {
        break;
      }
      queue = [...nextQueue];
      nextQueue = [];
    }
    return false;
  }
}

function getWordVariantsTrie(word, substitutionMap) {

  //given a character in a word
  if(word.length < 1){
    return null;
  }

  const wordTrie = new Trie(word[0]) 
  const nodeQueue = [wordTrie.getHead()];
  const remainingChars = word.substring(1).split('');

  let currentQueue = nodeQueue
  let nextQueue = []

  while(remainingChars.length > 0) {
    const currentChar = remainingChars.shift();

    if(!currentChar) {
      break;
    }

    for(currentNode of currentQueue) {
      const variantList = substitutionMap[currentChar]

      if(variantList) {
        for(let i=0; i< variantList.length; i++ ) {
          //add all variants as children to the current node
          nextQueue.push(currentNode.addChild(variantList[i]))
        }
      }

      nextQueue.push(currentNode.addChild(currentChar))
    }

    currentQueue = [...nextQueue];
    nextQueue = [];
  }

  return wordTrie;
}


//This represents doing it on startup and keeping the tries alive until 
// the service restarts so we don't pay the price every time
const badWordTries = bad_words.map((word) => getWordVariantsTrie(word, substitutions))


function areAnyBannedWordsInString(stringToSearch) {

  if(stringToSearch == null || stringToSearch.length < 1) {
    return false;
  }
 
  let currentCharacterIndex = 0;
  while(currentCharacterIndex < stringToSearch.length) {

    let remainingChars = stringToSearch.substring(currentCharacterIndex)
    for(trie of badWordTries) {      
      if(trie.matches(remainingChars)) {
        return true;
      }    
    }

    currentCharacterIndex++;
  }

  return false;
}

//TEST CASES

//getWordVariantsTrie(word, substitutionMap) --------------

//case 1 - word test
const substitutionsTest1 = {
  'o': ['0'],
}

console.log(`getWordVariantsTrie bob should be bob, b0b is: ${JSON.stringify(getWordVariantsTrie('bob', substitutionsTest1)) }`)

// case 2 - undefined case, what if the trie starts with a changeable letter?
const substitutionsTest2 = {
  'o': ['0'],
}
const input2 = 'ok'

//console.log(`getWordVariantsTrie ok should be ok, 0k is: ${JSON.stringify(getWordVariantsTrie(input2, substitutionsTest2)) }`)


//areAnyBannedWordsInString(stringToSearch) ------------------


console.log(`areAnyBannedWordsInString foo| should be true, is: ${areAnyBannedWordsInString('foo|')}`)
console.log(`areAnyBannedWordsInString fool should be true, is: ${areAnyBannedWordsInString('fool')}`)
console.log(`areAnyBannedWordsInString af0ola should be true, is: ${areAnyBannedWordsInString('af0ola')}`)
console.log(`areAnyBannedWordsInString nope should be false, is: ${areAnyBannedWordsInString('nope')}`)
console.log(`areAnyBannedWordsInString aaaaaaaafool should be true, is: ${areAnyBannedWordsInString('aaaaaaaafool')}`)
