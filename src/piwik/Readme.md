# WTF? Why is a Piwik translation file in here?

Because they use the german <em>Sie</em> and that doesn't match the tone of the website. So I keep the changed translation file here in the repository.

## Workflow

* Copy file to server.
* Delete cache file in ``/path/to/piwik/tmp/cache/tracker/piwikcache_Translations-de-*.php``.
* Repeat after every Piwik update. :-(

There's a e2e test checking if Piwik reverted the changes.
