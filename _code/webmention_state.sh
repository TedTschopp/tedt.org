#!/usr/bin/env bash
# Keep delivery receipts off main so they cannot block other publishers' deploy checks.
set -euo pipefail
mode=${1:?Use load or save}
state_path=${2:-cache/webmention-outbox.json}
state_ref=refs/heads/indieweb-state
mkdir -p tmp/indieweb-state "$(dirname "$state_path")"
parent_file=tmp/indieweb-state/parent
previous_file=tmp/indieweb-state/previous.json

case "$mode" in
  load)
    if git ls-remote --exit-code --heads origin "$state_ref" > tmp/indieweb-state/ref; then
      git fetch --no-tags origin "$state_ref"
      parent=$(git rev-parse FETCH_HEAD)
      git show "$parent:webmention-outbox.json" > "$state_path"
      printf '%s\n' "$parent" > "$parent_file"
      cp "$state_path" "$previous_file"
    else
      status=$?
      if [ "$status" -ne 2 ]; then
        echo 'Cannot read the delivery state branch; refusing to reset it.' >&2
        exit "$status"
      fi
      if [ -f "$state_path" ]; then
        echo 'Unexpected local delivery state without a remote branch.' >&2
        exit 1
      fi
      : > "$parent_file"
      echo 'No delivery state branch yet; the first deployment will create a baseline.'
    fi
    ;;
  save)
    test -f "$parent_file"
    if [ ! -f "$state_path" ]; then exit 0; fi
    if [ -f "$previous_file" ] && cmp -s "$state_path" "$previous_file"; then
      echo 'Delivery state unchanged.'
      exit 0
    fi
    parent=$(cat "$parent_file")
    index_dir=$(mktemp -d)
    trap 'rm -rf "$index_dir"' EXIT
    export GIT_INDEX_FILE="$index_dir/index"
    if [ -n "$parent" ]; then
      git read-tree "$parent^{tree}"
    else
      git read-tree --empty
    fi
    blob=$(git hash-object -w "$state_path")
    git update-index --add --cacheinfo "100644,$blob,webmention-outbox.json"
    tree=$(git write-tree)
    git config user.name 'github-actions[bot]'
    git config user.email '41898282+github-actions[bot]@users.noreply.github.com'
    if [ -n "$parent" ]; then
      commit=$(git commit-tree "$tree" -p "$parent" -m 'chore(indieweb): retain delivery receipts')
    else
      commit=$(git commit-tree "$tree" -m 'chore(indieweb): retain delivery receipts')
    fi
    # Normal fast-forward push: a competing writer fails instead of overwriting receipts.
    git push origin "$commit:$state_ref"
    ;;
  *)
    echo 'Use load or save.' >&2
    exit 1
    ;;
esac
