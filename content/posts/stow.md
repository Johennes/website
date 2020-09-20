---
title: "Using GNU Stow to Manage Dotfiles on Different Machines"
date: 2020-09-20
lastmod: 2020-09-20
draft: false
tags: ["bash", "dotfiles", "linux", "stow"]
---

The idea of using [GNU Stow] to manage dotfiles is nothing new so I'll leave out the basics (see e.g. [Alex Pearce's article] for an introduction). In this post I'll describe how I extended the concept to be able to handle per-machine configurations.

## Motivation

I have a mixed setup where my work laptop runs macOS while my private notebook at home is operated by varying flavors of GNU/Linux. There are multiple reasons for not using the same set of dot files on both machines:

1. The dotfiles I use at work are packed with work-specific settings and programs that I don't want to leak into my private machine. First of all, I don't need most of them in my non-work endeavours. Secondly, I don't want to make my private environment dependent on the choices and compromises taken at work.
1. macOS ships with the BSD variant of common userland tools such as `find`, `sed` and `grep` which are often not fully compatible with their GNU counterparts. I certainly don't want to install the usually less versatile BSD programs on Linux. While I could install the GNU programs on macOS, I'd like to avoid that because it'll make it easy to accidentally write shared code that won't run on my colleagues' macs unless they also have the GNU tools installed. As a result, any shell scripts that I maintain as part of my dotfiles would only be allowed to use the subset of features available in both toolsets.
1. Similar to the point above but more general, any programs bundled with my dotfiles would need to be compatible with both macOS and Linux.

At the same time parts of my dotfiles _do_ apply to both machines so I would like to maintain everything in one and the same place.

## Putting it Together

I first thought about fiddling with multiple repositories and git submodules or using one of the fancy dotfile managers that keep sprouting everywhere. Then I realised, that with Stow it's all there already. The only things needed are a folder hierarchy and a small shell script to stow dotfiles from different folders based on the current machine.

Here is a snapshot of my folder hierarchy. Files needed on both machines are in the `common` folder whereas files that are only relevant to one of the machines are in the `linux` and `mac` folders, respectively.

```
$ tree -a stow/
stow/
├── common
│   ├── git
│   │   └── .gitconfig
│   └── ...
├── linux
│   ├── bash
│   │   └── .bashrc
│   └── ...
└── mac
    ├── bash
    │   └── .bash_profile
    ├── hammerspoon
    │   └── .hammerspoon
    │       └── init.lua
    ├── nuke
    │   ├── .bash_completion.d
    │   │   └── nuke
    │   └── .local
    │       └── bin
    │           └── nuke
    └── ...
```

As you can see my `.gitconfig` is shared between both machines. I use the same global settings for git everywhere and customize things such as the email address with a per-repository config as needed.

My dotfiles for bash, on the other hand, are split out between the `linux` and `mac` folders. For one thing, this is because they contain wildly different and unrelated settings. For another, the macOS Terminal application idiotically ignores `.bashrc` and instead sources `.bash_profile` on launch. &#x1F926;

Finally, macOS-specific things like my Hammerspoon configuration and my `nuke` script (which currently only supports macOS because I didn't have the same usecase on Linux so far) are kept in the `mac` folder only.

So far, so good. All that's left to do now is install (or "stow") the right files based on the current machine. Luckily this is easily achieved with just a few lines of bash.

```
function stow_all {
    while read -r package; do
        stow -v -d "$1" -t ~ -R "$(basename "${package}")"
    done < <(find "$1" -mindepth 1 -maxdepth 1 -type d)
}

stow_all stow/common

case "$(uname -s)" in
    Linux*)
        stow_all stow/linux
        ;;
    Darwin*)
        stow_all stow/mac
        ;;
    *)
        echo "Error: Unknown system $(uname -s)"
        ;;
esac
```

Put that into an `install` script in the dotfiles repository and that's it. I now have a single git repository for my dotfiles on multiple machines and an automatic way to install them.

## Conclusion

GNU Stow makes this exercise a breeze. There's no need for writing a complicated configuration file or learning a new DSL. It's just files, folders and a trivial shell script. The concept is also easy to extend to more complicated machine setups. For instance, you could tweak the `case` statement to infer the current machine based on other environment parameters or simply add a dedicated argument to specify the folders to stow.

If you're interested in my own dotfiles and `install` script, check out [my dotfiles repository]. 

  [Alex Pearce's article]: https://alexpearce.me/2016/02/managing-dotfiles-with-stow/
  [GNU Stow]: https://www.gnu.org/software/stow/
  [my dotfiles repository]: https://nosuchdomain.mooo.com/git/doc/dotfiles
