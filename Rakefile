require 'rake'
require 'fileutils'

def link(target, new)
  FileUtils.ln_s target, new rescue puts("~/#{new} exists.")
end

def unlink(name)
  FileUtils.rm name, :force => true
end


desc "enable caching"
task :cacheon do
  link 'cache.manifest-example', 'cache.manifest'
  link 'htaccess-example', '.htaccess'
end

desc "disable caching"
task :cacheoff do
  unlink 'cache.manifest'
  unlink '.htaccess'
end

desc "compass: watch scss changes and compile to css"
task :watch do
  system %Q{compass watch resources/scss}
end
