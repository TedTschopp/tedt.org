# == Module: WLINKS
# Generates WinerLinks for all chapters in a post.
#
# Author: Daniel Roos <daniel@micronerds.org>
#
require 'digest/md5'

module WLINKS
  class Generator < Jekyll::Generator
    def generate(site)
      Jekyll.logger.info 'Running wlinks-plugin'

      anchorSymbol = site.config['wlinks']['symbol'] ||= '#'
      anchorTitle  = site.config['wlinks']['title'] ||= 'Anchor'
      anchorCheck  = site.config['wlinks']['check'] ||= 'partitial'

        site.posts.each_with_index do |postcontent, key|

          # Skip execution when disabled for a post
          next if postcontent.data['wlinks'] == false

          # Control variables
          previousLine      = ''
          currentBlock      = false
          currentPost       = ''
          paragraphChecksum = ''

          # Iterate through each line of a post
          postcontent.content.each_line do |line|

            backupLine = line

            # Lines with text after a blank line indicate a possible
            # new paragraph
            if not line.to_s.match(/^\s*$/) and previousLine.chomp().empty? and currentBlock == false

              # Mark exceptions for
              # - Code blocks
              # - Highlighblocks
              if (
                (
                  line.match(/\s*\`\`\`/) or
                  line.match(/\{\%.*highlight.*\%\}/)
                ) and 
                currentBlock == false
                 )

                currentBlock = true

              end

              # Reading a text line and creating a checksum for the anchor
              if anchorCheck.downcase == 'complete' 
                paragraphChecksum = Digest::SHA256.hexdigest(line).to_s
              else
                paragraphChecksum = Digest::SHA256.hexdigest(line[0,20]).to_s
              end
              paragraphChecksum = paragraphChecksum[0,7]

              # Adding an anchor with the checksum
              currentPost = currentPost.chomp() + '<a name="' + paragraphChecksum + '"></a>' + "\n\n"

            elsif (
              line.match(/^$/) and
              not previousLine.chomp().empty? and 
              currentBlock == false
              )

              # Add Link to current Post
              currentPost = currentPost.chomp() + '&nbsp;[' + anchorSymbol + '](#' + paragraphChecksum.to_s + ' "' + anchorTitle + '")' + "\n"

            
            elsif ( # Detect the end of a code block
              previousLine.match(/(\s*```)|(\{\%\sendhighlight\s\%\})/) and
              currentBlock == true and
              line.chomp().match(/^$/)
            )

              currentBlock = false

            elsif ( # Detecting Headlines
              not line.chomp().match(/^\s*$/) and
              previousLine.chomp().match(/^\#?\s.*/) and
              currentBlock == false
            )

              currentPost = currentPost.chomp() + '&nbsp;[' + anchorSymbol + '](#' + paragraphChecksum.to_s + ' "' + anchorTitle + '")' + "\n"

            end

            currentPost += line.to_s
            previousLine = backupLine.to_s

          end # end of current post loop

          # Update the post content
          site.posts[key].content = currentPost

        end
    end
  end
end