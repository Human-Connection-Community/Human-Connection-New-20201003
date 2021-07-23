##################################################################################
# COMMUNITY ######################################################################
##################################################################################
FROM neo4j:4.3.2 as community

# ENVs
## We Cannot do `$(date -u +'%Y-%m-%dT%H:%M:%SZ')` here so we use unix timestamp=0
ARG BBUILD_DATE="1970-01-01T00:00:00.00Z"
ENV BUILD_DATE=$BBUILD_DATE
## We cannot do $(yarn run version)-${BUILD_NUMBER} here so we default to 0.0.0-0
ARG BBUILD_VERSION="0.0.0-0"
ENV BUILD_VERSION=$BBUILD_VERSION
## We cannot do `$(git rev-parse --short HEAD)` here so we default to 0000000
ARG BBUILD_COMMIT="0000000"
ENV BUILD_COMMIT=$BBUILD_COMMIT

# Labels
LABEL org.label-schema.build-date="${BUILD_DATE}"
LABEL org.label-schema.name="ocelot.social:backend"
LABEL org.label-schema.description="Neo4J database of the Social Network Software ocelot.social with preinstalled database constraints and indices"
LABEL org.label-schema.usage="https://github.com/Ocelot-Social-Community/Ocelot-Social/blob/master/README.md"
LABEL org.label-schema.url="https://ocelot.social"
LABEL org.label-schema.vcs-url="https://github.com/Ocelot-Social-Community/Ocelot-Social/tree/master/backend"
LABEL org.label-schema.vcs-ref="${BUILD_COMMIT}"
LABEL org.label-schema.vendor="ocelot.social Community"
LABEL org.label-schema.version="${BUILD_VERSION}"
LABEL org.label-schema.schema-version="1.0"
LABEL maintainer="devops@ocelot.social"

# Install Additional Software
## install: wget, htop (TODO: why do we need htop?)
RUN apt-get update && apt-get -y install wget htop
## install: apoc plugin for neo4j
RUN wget https://github.com/neo4j-contrib/neo4j-apoc-procedures/releases/download/3.5.0.4/apoc-3.5.0.4-all.jar -P plugins/

##################################################################################
# ENTERPRISE #####################################################################
##################################################################################
FROM neo4j:4.3.2 as enterprise

# Install Additional Software
## install: wget, htop (TODO: why do we need htop?)
RUN apt-get update && apt-get -y install wget htop
## install: apoc plugin for neo4j
RUN wget https://github.com/neo4j-contrib/neo4j-apoc-procedures/releases/download/3.5.0.4/apoc-3.5.0.4-all.jar -P plugins/