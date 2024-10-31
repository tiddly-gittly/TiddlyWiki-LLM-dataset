# Dataset

We generate [ChatML](https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/chat-markup-language) files from `.tid` files in TiddlyWiki. Each tid file may generate multiple object in a JSON file.

## Format

### ChatML

Format is like this using [ChatML](https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/chat-markup-language), 

```chatml
<|im_start|>system
system instructions here
<|im_end|>
```

this is equivalent to this JSON

```json
{
  "system": "system instructions here"
}
```

where `<|im_start|>system` just means a field "system". And `<|im_start|>user` means another field "user". They are all closed by mark `<|im_end|>`.

Multiple chats in a same file are separated by two new lines between `<|im_end|>` and `<|im_start|>system`:

```chatml
<|im_end|>


<|im_start|>system
```

### Generated chat materials

we will either place "original tid content" in `user` or `output`, and use LLM to generate another parts. And we will finally invite humans to review it.

```chatml
<|im_start|>system
Add comments to explain the wikitext line by line
<|im_end|>
<|im_start|>user
<$action-sendmessage $message="tm-new-tiddler" type={{{ [{$:/config/NewImageType}addprefix[image/]] }}}/>
<|im_end|>
<|im_start|>assistant
<-- comment xxx ->
<$action-sendmessage $message=..."
<|im_end|>


<|im_start|>system
Explain the wikitext in natural language for user new to WikiText.
<|im_end|>
<|im_start|>user
What does this mean?
<$action-sendmessage $message="tm-new-tiddler" type={{{ [{$:/config/NewImageType}addprefix[image/]] }}}/>
<|im_end|>
<|im_start|>assistant
This is a ..."
<|im_end|>


<|im_start|>system
<|im_end|>
<|im_start|>user
Write an action to create new tiddler
<|im_end|>
<|im_start|>assistant
<$action-sendmessage $message="tm-new-tiddler" type={{{ [{$:/config/NewImageType}addprefix[image/]] }}}/>"
<|im_end|>


<|im_start|>system
<|im_end|>
<|im_start|>user
Write an action to create new tiddler, with metadata
<|im_end|>
<|im_start|>assistant
title: $:/core/ui/Actions/new-image
tags: $:/tags/Actions
description: create a new image tiddler

\\whitespace trim
<$action-sendmessage $message="tm-new-tiddler" type={{{ [{$:/config/NewImageType}addprefix[image/]] }}}/>
<|im_end|>
```

This means we reuse same wikitext in multiple tasks. 

### Path and file name

Folder structure is the same as its original tid file path, like `core/ui/Actions/new-image.tid` will map to `data/core/ui/Actions/new-image.20250101.chatml`. With a timestamp, because we expect wikitext will update in the future.

### Snapshot

The first one's "user" part is always the original wikitext, and its output is wikitext with comment. This allows we get the original text.

For example

```chatml
<|im_start|>system
Add comments to explain the wikitext line by line
<|im_end|>
<|im_start|>user
[ext[https://link.here]]
<|im_end|>
<|im_start|>assistant
<-- `[ext[]]` means an external link... ->
[ext[https://link.here]]
<|im_end|>
```

## AI prompt

We generate material so human don't need to create them from scratch.

Prompts are WikiText tiddlers with variable transclusion, in the [wiki's 'prompts](.wiki/tiddlers/prompts) folder.

## Review

In the review platform, there are "original language" and "translation" areas, because we are using a translating review platform.

Original WikiText + AI prompt that generate the material will be the "original language", and AI generated chat material can will put in the "translation" area, open for human to review.

You can join the project in [Paratranz](https://paratranz.cn/projects/12129), and review each material, edit them to be correct (AI will have mistake, they don't understand WikiText well, because there was never good learning material before like we are creating).
