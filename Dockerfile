FROM node:12.22.3

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# 将物理机中的 node_modules 映射到容器中的 node_modules
COPY ./server/node_modules /usr/src/node_modules

# npm 镜像源设置为淘宝镜像源
RUN npm set registry https://registry.npm.taobao.org/

# 增加 pm2 日志打印
RUN ./../node_modules/pm2/bin/pm2 install pm2-logrotate@2.4.0

# 单个pm2 日志文件最大为 10M
RUN ./../node_modules/pm2/bin/pm2 set pm2-logrotate:max_size 10M

# 保存所有日志
RUN ./../node_modules/pm2/bin/pm2 set pm2-logrotate:retain all

CMD ["./../node_modules/pm2/bin/pm2-docker", "process.yml"]