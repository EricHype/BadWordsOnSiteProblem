# Problem

When a user signs up for our service, we want to filter out bad language.

However, our users are crafty and oftentimes use symbols (leetspeak) to try and get around our filters.

In example:
The letter `O` can be replaced by the number `0`
The letter `L` can be replaced by `1` or `|`

So if a bad word was `fool` our variants would be:
* fool
* foo1
* foo|
* f0ol
* f0o1
* f0o|
* f00l
* f001
* f00|
* fo0l
* fo01
* fo0|

We also would need to match if a bad word is buried inside the name, such as:
* Youf00l1234

The task is given a list of bad words, and a map of letter variants, determine if a string contains a bad word.

#### Notes
Interviewer pushed me towards a Trie-based solution. I hadn't implemented a Trie in years, so I was slow-ish to produce one. I think my navigation strategy for the Trie is too inefficient.

My solution was to create the Tries for each word, then do a BFS down the Trie. At each deeper level of the Trie, we would have to check the next character in the string. This process would be repeated until we reached the end of the string or if we reached a leaf of the Trie (matching) or if no nodes match to the current character (fail-out case).

### Running
I have a few test cases at the bottom of the file to exercise the code, they can be run with `node ./index.js`