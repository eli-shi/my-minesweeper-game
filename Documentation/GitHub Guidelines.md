### Branches

The main branch should never be where you make changes and commit. Whatever changes happen to main are when a specific branch (feature, tests, etc.) are only merged after they have been tested to not conflict.

For any refactoring, feature, or debugging being done there will be a separate branch created, starting with the category, forward slash and then name of specifically what you are working on(if the name is too long do your best to come up with a shorter one that get the idea across to other developers). 

Examples:
- feature/<name of the feature>
- debug/<name of the bug, some sort of descriptor, etc. >
- refactoring/<what you are refactoring>

Feature refers to creating a behavior from scratch, update refers to advancing code to have more behaviors in some way, refactoring means changing the code base without ultimately changing the behavior of the code (for cleaning or to incorporate changes made to dependencies/imports), and debug means changing the code to behave how it was intended to behave.

Once the branch is finished, the finished code will go through the review process and then be merged to the main branch.

### Helpful commit messages

1. We can see what changes you made to the code base(HOW), use the commit message to instead explain the changes you(WHAT and WHY)
2. Separate subject(<50 characters) from body(<72 characters) with a blank line
3. Start subject with the “Imperative Mood”

- style: <changes made to the visuals of the user interface>
- ref: <refactoring of code>
- test: <wrote tests for code>
- fix: <fixed a problem with the code>
- feat: <a new feature>
- remove: <removed an unnecessary piece of code>\
- chore: <>

1. Look into [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)

### General tips

I highly encourage you to use GitKraken. While learning how to use the command lines for git is incredibly important and using them whenever you can is great, for me personally, having a visual to navigate the branches (especially if more developers join and there are many things going on at the same time) makes it less confusing.

Make sure to commit things that are relevant to each other. If you do multiple things that are not related to each other, make sure to only add the file changes that are relevant to the commit and organize them your series of commits this way.

Commit messages are important! Even a small sentence to explain what you did is better than nothing or something vague and unclear. This becomes incredibly important as more developers join a project and code reviews become common, people should be able to look at your commit message and understand the general changes that are made.