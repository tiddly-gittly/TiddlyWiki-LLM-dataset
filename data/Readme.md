# Dataset

We generate JSON from `.tid` files in TiddlyWiki. Each tid file may generate multiple object in a JSON file.

## Format

Format is like this, we will either place "original tid content + question" in `input` or `output`, and use LLM to generate another part. And let human to review it.

```json
[
    {
      "input": "<$action-sendmessage $message=\"tm-new-tiddler\" type={{{ [{$:/config/NewImageType}addprefix[image/]] }}}/>",
      "output": "<-- comment xxx ->\n\n<$action-sendmessage $message=..."
    },
    {
      "input": "What does this mean? Explain the wikitext\n\n<$action-sendmessage $message=\"tm-new-tiddler\" type={{{ [{$:/config/NewImageType}addprefix[image/]] }}}/>",
      "output": "This is a ..."
    },
    {
      "input": "Write an action to create new tiddler",
      "output": "<$action-sendmessage $message=\"tm-new-tiddler\" type={{{ [{$:/config/NewImageType}addprefix[image/]] }}}/>"
    },
    {
      "input": "Write an action to create new tiddler, with metadata",
      "output": "title: $:/core/ui/Actions/new-image\ntags: $:/tags/Actions\ndescription: create a new image tiddler\n\\whitespace trim\n<$action-sendmessage $message=\"tm-new-tiddler\" type={{{ [{$:/config/NewImageType}addprefix[image/]] }}}/>
"
    }
]
```

This means we reuse same wikitext in multiple tasks.

### Path and file name

Folder structure is the same as its original tid file path, like `core/ui/Actions/new-image.tid` will map to `data/core/ui/Actions/new-image.20250101.json`. With a timestamp, because we expect wikitext will update in the future.

### Snapshot

The first one's input is always the original wikitext, and its output is wikitext with comment. This allows we get the original text.

## Review

In the review platform, the "original tid content + question" will be the "original language", and "LLM generated part" will put in the "translation" area, open for human to review.
