# TiddlyWiki-LLM-dataset

WikiText syntax dataset for auto UI generation in TiddlyWiki.

## Pipeline

1. Read folders in the config. This will create snapshot of TW core and plugins. And skip the duplication if text is same as first item's input (See [data](./data/Readme.md) for detail about snapshot).
1. Generate more QA pair with templates
1. Generate missing Q or A using LLM
1. Generate review API call and upload to review platform
1. Ask community for help reviewing
1. Import updated wikitext when TiddlyWiki version bump and rerun the above pipeline
1. Export dataset for LLM fine-tune
