# README

## Setting the Scene

I like to make AI-generated images of small horses and post them on the internet. I usually upload them to Catbox and post their Catbox links on 4chan. Sometimes the images get uploaded to [Tantabus](https://tantabus.ai/), either by me or by someone else.

## The Problem

Once an image is on Tantabus, I want to put my `prompter:iwtcipp` tag on it, but before then, I'm acting anonymously. By default, I have no proof that the images are actually "mine". The community seems happy to work on an honor system, but I want to be able to provide proof anyway.

## The Solution for New Images

I've started digitally signing files before I upload them to Catbox. The signatures will be verifiable with a tool that I haven't made yet (watch this space if you care).

## The Solution for (Some) Old Images

This repo contains [a GitHub workflow](/blob/main/.github/workflows/workflow.yml) that [makes some web requests, logs information about their results](/blob/main/script.js), and generates an attestation for [the log file](/blob/main/output.txt). Having run that, I can now provide proof that, for some images, the following is true:

1. The image was uploaded to Tantabus at time T (based on `created_at` and `orig_sha512_hash`).
2. The image was linked to on 4chan at time F (based on a Desuarchive `timestamp` and the presence of a specific Catbox URL in the associated `comment`).
3. The image was uploaded to Catbox at time C (based on the `last-modified` header and hashes of the Catbox version of the file).
4. The image existed in a Dropbox account at time D (based on a file revision's `server_modified` and `content_hash` values).
5. T > F > C > D.

Informally speaking, I can show that the images were in my Dropbox account before they were publicly available, so they must have come from me.
