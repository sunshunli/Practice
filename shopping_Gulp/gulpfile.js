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
    runSequence = require('gulp-run-sequence'),
    clean=require('gulp-clean');// 清理

// 1. LESS编译 压缩 --合并没有必要，一般预处理CSS都可以导包
gulp.task('style', function() {
  return gulp.src(['src/styles/*.less', 'src/styles/*.css', '!src/styles/_*.less'])
    .pipe(sass().on('error', sass.logError))
    .pipe(cssnano())
    .pipe(rev())
    .pipe(gulp.dest('dist/styles'))
    .pipe(rev.manifest({
  		merge: true
	}))
    .pipe(gulp.dest('rev/styles'));
});

// 2. JS合并 压缩混淆
gulp.task('script', function() {
  return gulp.src('src/scripts/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(concat({path: 'bundle.js', cwd: ''}))
    .pipe(uglify())
    .pipe(rev())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/scripts'))
    .pipe(rev.manifest({
  		merge: true
	}))
    .pipe(gulp.dest('rev/scripts'));
});
// 3. 图片复制
gulp.task('image', function() {
  return gulp.src('src/images/*.*')
    .pipe(rev())
    .pipe(gulp.dest('dist/images'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// 4. HTML
gulp.task('html', function() {
  return gulp.src('src/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// 5. 清理文件, 必须使用return实现异步
gulp.task('clean', function() {
  return gulp.src('dist', {read: false})
    .pipe(clean());
});

// 6. 路径替换任务，因为使用了gulp-rev,编译后的文件名改变了，所以要修改html中引用的文件名
gulp.task('rev',function(){
  return gulp.src(['rev/*/*json','src/*.html'])
    .pipe(revCollector({
      replaceReved: true
    }))
    .pipe(gulp.dest('src'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// 7. 热加载
gulp.task('serve', function() {
  browserSync({
    server: {
      baseDir: './',
      index: 'dist/index.html'
    },
  }, function(err, bs) {
    console.log(bs.options.getIn(["urls", "local"]));
  });
  gulp.watch('src/styles/*.css',['style']);
  gulp.watch('src/scripts/*.js',['script']);
  gulp.watch('src/images/*.*',['image']);
  gulp.watch('src/*.html',['html']);
  // 只要rev-manifest.json文件变化说明src里有文件变化，即开始修改html里的内容
  gulp.watch('rev/*/*json',['rev']);
});

// 8. gulp-clean的异步方法，'clean'任务先执行，gulp.start里面的任务没有固定顺序执行
gulp.task('default', ['clean'], function() {
  gulp.start(['style', 'script', 'image', 'html']);
  gulp.start(['rev', 'serve']);
});
