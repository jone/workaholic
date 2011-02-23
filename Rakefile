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

desc "download sencha touch and install it"
task :install do
  if File.directory? 'sencha-touch'
    puts "FAILED: sencha-touch directory already exists"
    exit
  end
  system %Q{
wget http://downloads.sencha.com/touch/sencha-touch-1.0.1a.zip
unzip sencha-touch-1.0.1a.zip
mv sencha-touch-1.0.1a sencha-touch
rm sencha-touch-1.0.1a.zip}
end

desc "build css"
task :build do
  system %Q{compass compile resources/scss}
end

desc "create distribution"
task :dist do
  peter = 'hans'
  system %Q{
mkdir dist
cp -RH `cat cache.manifest-example|grep -v '^#'|grep -v 'CACHE'|cut -d '/' -f 1` dist
cp cache.manifest-example dist/cache.manifest
cp htaccess-example dist/.htaccess
cd dist
tar -czf ../workaholic-dist-`date "+%Y-%m-%d_%H-%M"`.tar.gz `cat ../cache.manifest-example|grep -v '^#'|grep -v 'CACHE'` .htaccess cache.manifest
cd ..
rm -rf dist
}
end
