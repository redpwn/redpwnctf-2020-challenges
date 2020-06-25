FROM node:12.16.3-buster-slim
WORKDIR /app
COPY package.json yarn.lock /app/
RUN yarn --prod --frozen-lockfile
COPY . ./
ENV APP_PORT 8001
ENV RAW_PORT 8002
ENV RAW_ORIGIN https://raw.maria-bin.tk
ENV ADMIN_NAME king-horse-5diuoe7tpxjen8xu0n7
ENV TOKEN_KEY HRbpVjEjNuta6G7CDLCXmpwhxLeHMmZ15vdCnAf5AnI=
ENV FLAG flag{s0ci3tat1bus_3qu1tuM_sEmp3r}
USER node
CMD ["node", "app"]
