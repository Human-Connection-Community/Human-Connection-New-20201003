##################################################################################
# BASE (Is pushed to DockerHub for rebranding) ###################################
##################################################################################
FROM node:15.14.0-alpine3.10 as base

# ENVs
## DOCKER_WORKDIR would be a classical ARG, but that is not multi layer persistent - shame
ENV DOCKER_WORKDIR="/app"
## We Cannot do `$(date -u +'%Y-%m-%dT%H:%M:%SZ')` here so we use unix timestamp=0
ARG BBUILD_DATE="1970-01-01T00:00:00.00Z"
ENV BUILD_DATE=$BBUILD_DATE
## We cannot do $(yarn run version)-${BUILD_NUMBER} here so we default to 0.0.0-0
ARG BBUILD_VERSION="0.0.0-0"
ENV BUILD_VERSION=$BBUILD_VERSION
## We cannot do `$(git rev-parse --short HEAD)` here so we default to 0000000
ARG BBUILD_COMMIT="0000000"
ENV BUILD_COMMIT=$BBUILD_COMMIT
## SET NODE_ENV
ENV NODE_ENV="production"
## App relevant Envs
ENV PORT="4000"

# Labels
LABEL org.label-schema.build-date="${BUILD_DATE}"
LABEL org.label-schema.name="ocelot.social:backend"
LABEL org.label-schema.description="Backend of the Social Network Software ocelot.social"
LABEL org.label-schema.usage="https://github.com/Ocelot-Social-Community/Ocelot-Social/blob/master/README.md"
LABEL org.label-schema.url="https://ocelot.social"
LABEL org.label-schema.vcs-url="https://github.com/Ocelot-Social-Community/Ocelot-Social/tree/master/backend"
LABEL org.label-schema.vcs-ref="${BUILD_COMMIT}"
LABEL org.label-schema.vendor="ocelot.social Community"
LABEL org.label-schema.version="${BUILD_VERSION}"
LABEL org.label-schema.schema-version="1.0"
LABEL maintainer="devops@ocelot.social"

# Install Additional Software
## install: git
RUN apk --no-cache add git

# Settings
## Expose Container Port
EXPOSE ${PORT}

## Workdir
RUN mkdir -p ${DOCKER_WORKDIR}
WORKDIR ${DOCKER_WORKDIR}

##################################################################################
# DEVELOPMENT (Connected to the local environment, to reload on demand) ##########
##################################################################################
FROM base as development

# We don't need to copy or build anything since we gonna bind to the
# local filesystem which will need a rebuild anyway

# Run command
# (for development we need to execute yarn install since the
#  node_modules are on another volume and need updating)
CMD /bin/sh -c "yarn install && yarn run dev"

##################################################################################
# CODE (Does contain all code files and is pushed to DockerHub for rebranding) ###
##################################################################################
FROM base as code

# copy everything, but do not build.
COPY . .

##################################################################################
# BUILD (Does contain all files and the compilate and is therefore bloated) ######
##################################################################################
FROM code as build

# yarn install
RUN yarn install --production=false --frozen-lockfile --non-interactive
# yarn build
RUN yarn run build

##################################################################################
# TEST ###########################################################################
##################################################################################
FROM build as test

# Run command
CMD /bin/sh -c "yarn run dev"

##################################################################################
# PRODUCTION (Does contain only "binary"- and static-files to reduce image size) #
##################################################################################
FROM base as production

# Copy "binary"-files from build image
COPY --from=build ${DOCKER_WORKDIR}/dist ./dist
# Copy static files
# TODO - externalize the uploads so we can copy the whole folder
COPY --from=build ${DOCKER_WORKDIR}/public/img/ ./public/img/
COPY --from=build ${DOCKER_WORKDIR}/public/providers.json ./public/providers.json
# Copy package.json for script definitions (lock file should not be needed)
COPY --from=build ${DOCKER_WORKDIR}/package.json ./package.json

# Run command
CMD /bin/sh -c "yarn run start"
