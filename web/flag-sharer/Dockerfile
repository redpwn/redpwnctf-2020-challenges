FROM node:12.16.3-buster-slim
WORKDIR /app
COPY package.json yarn.lock /app/
RUN yarn --prod --frozen-lockfile
COPY . ./
ENV PORT 8000
ENV ADMIN_ID 3a09316c82c17baaa2d784256837cd12
ENV FLAG flag{th3_4dmIn_Giv3s_thE_b3st_Fl@gS}
USER node
CMD ["node", "app"]
