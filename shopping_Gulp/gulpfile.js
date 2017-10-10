'use strict'
/*
 * @Author: Shunli Sun
 * @Date:   2017-10-09
 * @Last Modified by:   Shunli Sun
 * @Last Modified time: 2017-10-09
 */
'use strict';
/**
 * 1. LESS编译 压缩 合并
 * 2. JS合并 压缩 混淆
 * 3. img复制
 * 4. html压缩
 * 5. 文件清理
 * 6. 热加载
 */
// 在gulpfile中先载入gulp包，因为这个包提供了一些API
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    cssnano = require('gulp-cssnano'), // css压缩
    browserSync = require('browser-sync'), // 同步浏览器
    htmlmin = require('gulp-htmlmin'), // 压缩html文件
    concat = require('gulp-concat'), // 文件合并
    uglify = require('gulp-uglify'), // js压缩
    babel = require('gulp-babel'),
    rev=require('gulp-rev'), // 对文件名加MD5后缀防止缓存
    revCollector=require('gulp-rev-collector'), // 路径替换
    sourcemaps = require('gulp-sourcemaps'),
    clean=require('gulp-clean');// 清理

// 1. LESS编译 压缩 --合并没有必要，一般预处理CSS都可以导包
gulp.task('style', function() {
  gulp.src(['src/styles/*.less', 'src/styles/*.css', '!src/styles/_*.less'])
    .pipe(sass().on('error', sass.logError))
    .pipe(cssnano())
    .pipe(rev())
    .pipe(gulp.dest('dist/styles'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('rev/styles'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// 2. JS合并 压缩混淆
gulp.task('script', function() {
  gulp.src('src/scripts/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(concat({path: 'bundle.js', cwd: ''}))
    .pipe(uglify(/*{
      mangle: true, // false不混淆变量名，true为混淆
      preserveComments: 'some' // 不删除注释，还可以为false（删除全部注释）some（保留@preserve @license @cc_on等注释）
    }*/))

    .pipe(rev())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('rev/scripts'))
    .pipe(browserSync.reload({
      stream: true
    }));
});
// 3. 图片复制
gulp.task('image', function() {
  gulp.src('src/images/*.*')
    .pipe(rev())
    .pipe(gulp.dest('dist/images'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// 4. HTML
gulp.task('html', function() {
  gulp.src('src/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// 5. 清理文件
gulp.task('clean', function() {
  return gulp.src('dist', {read: false})
    .pipe(clean());
});

// 6. 路径替换任务，因为使用了gulp-rev,编译后的文件名改变了，所以要修改html中引用的文件名
gulp.task('rev',function(){
  gulp.src(['rev/*/*json','src/*.html'])
    .pipe(revCollector({
      replaceReved: true
    }))
    .pipe(gulp.dest('./dist'));
});

// 7. 热加载
gulp.task('serve', function() {
  browserSync({
    server: {
      baseDir: ['dist']
    },
  }, function(err, bs) {
    console.log(bs.options.getIn(["urls", "local"]));
  });
  gulp.watch('src/styles/*.css',['style']);
  gulp.watch('src/scripts/*.js',['script']);
  gulp.watch('src/images/*.*',['image']);
  gulp.watch('src/*.html',['html']);
});

// 8. gulp-clean的异步方法，防止出现删除文件和创建编译文件同步发生
gulp.task('default', ['clean'], function() {
  gulp.start(['style', 'script', 'image', 'html', 'rev', 'serve' ]);
});