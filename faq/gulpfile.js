/**
 * 处理css脚本
 * @author: shenzm<zhimin.shen@yoho.cn>
 * @date: 2017/1/05
 *
 * 1. 安装node
 * 2. npm install
 * 3. 开发：npm run dev
 * 4. 生产：npm run pro
 */

'use strict';
const path = require('path');
const gulp = require('gulp');
const postcss = require('gulp-postcss');
const cssnano = require('gulp-cssnano');
const scss = require('postcss-scss');
const minify = require('minify');

const postcssPlugin = () => {
    let plugins = [
        require('postcss-import')({
            resolve(id) {
                let name = path.basename(id);

                if (!/^_/.test(name)) {
                    id = path.dirname(id) + '/_' + name;
                }
                return id;
            }
        }),
        require('precss'),
        require('postcss-calc'),
        require('postcss-pxtorem')({
            rootValue: 40,
            unitPrecision: 5, // 保留5位小数字
            minPixelValue: 2, // 小于 2 时，不转换
            selectorBlackList: [], // 选择器黑名单，可以使用正则
            propWhiteList: [] // 属性名称为空，表示替换所有属性的值
        }),
        require('autoprefixer')({
            browsers: ['> 1%']
        })
    ];
    return plugins;
};

gulp.task('default', ['build', 'watch']);
gulp.task('watch', () => {
    gulp.watch('css/*.css', ['build']);
});
gulp.task('js:app',() => {
    return gulp.src(['js/faq.js'])
        .pipe(gulp.dest('./../dist/'));
})
gulp.task('build', () => {
    return gulp.src(['css/faq.css'])
        .pipe(postcss(postcssPlugin(), {
            parser: scss
        }))
        .pipe(cssnano({
            safe: true
        }))
        .pipe(gulp.dest('images/'));
});
gulp.task('ge', ['build','js:app'], () => {
    gulp.src('images/*')
        .pipe(gulp.dest('./../dist/images'));

    gulp.src('faq.html')
        .pipe(gulp.dest('./../dist/'));
})
