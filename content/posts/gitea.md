---
title: "Passwordless Push to Gitea Without SSH"
date: 2020-09-30
lastmod: 2020-09-30
draft: false
tags: ["bash", "git", "gitea"]
---

## Introduction

Self-hosting a Git service is great because you're in control and there's no third party governing access to your code. If the latter sounds like a non-issue to you, just recall that in October 2019 GitLab tried to roll out an update to its terms of service that required opting into telemetry. If you didn't want to accept these new terms, you would have lost access to their website. Fortunately, the folks over at GitLab were very sensitive to the community outrage following their announcement and [revised their plans] about a week later. That being said, events like this are a good reminder that (unless you're in a paid tier) you don't truly control anything you push to these services. The availability of whatever you enter or upload is at the service operator's discretion.

That's why things like [Gitea] or [Gogs] are great. If you host it, you're in charge. Not surprisingly though self-hosting doesn't come for free (few things in life do, really). Among others, you buy your freedom with time needed for setup and maintenance of your private instance. One interesting problem I faced recently was SSH access.

## Pushing with Ease

I'm currently hosting [my gitea instance] on an old ARM SBC running in my living room. Since this device is located inside my home network, I chose not to forward the SSH port to the outside world. I don't have a usecase for remotely logging into the box from outside my house so having the port open would only increase my attack surface. The downside of this choise is that I also cannot push to my repositories via SSH. Instead I'm being asked for my username and password on every push. A simple trick I came up with to overcome this limitation without hardcoding my password is to use an access token and a git alias.

First, I created a personal access token on the website of my Gitea instance and exported it in my shell environment. I put it into my `~/.bashrc_local` which is sourced from my `~/.bashrc` because I have the latter tracked in my [dotfiles repository] (and obviously I don't want to share my access token with the public).

```
$ cat ~/.bashrc_local 
export GITEA_ACCESS_TOKEN=...
```

Using the access token I can now push to a repository via a dedicated URL without entering any credentials.

```
$ git push https://$GITEA_ACCESS_TOKEN@$mygit.foo/user/repo.git
```

That's already great but still quite a mouthful. Git aliases to the rescue!

```
$ cat ~/.gitconfig 
[alias]
  psgt = !git push https://$GITEA_ACCESS_TOKEN@$(git config --get remote.origin.url | sed 's|https://||') $@
```

Now whenever I invoke `git psgt` inside one of my repositories, it'll automatically use my access token to construct the correct remote URL and push to it without asking for my username and password. Rejoice!

## Conclusion

From a security point of view this isn't perfect but at least comparable to using SSH without a key phrase. An attacker gaining access to my computer account, could steal my access token just like they could steal my private SSH key. The fact that the access token is made part of the URL is not an issue because we're using HTTPS.

[revised their plans]: https://about.gitlab.com/blog/2019/10/10/update-free-software-and-telemetry/
[Gitea]: https://gitea.io
[my gitea instance]: https://nosuchdomain.mooo.com/git/
[Gogs]: https://gogs.io/
[dotfiles repository]: https://nosuchdomain.mooo.com/git/doc/dotfiles