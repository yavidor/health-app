#!/usr/bin/env bash

set -x

REMOTE_EXECUTABLE_PATH='/home/yavidor/health-app/health-app'

function exec_on_ssh() {
    ssh -o ConnectTimeout=5 yavidor@raspberry $@
}

function log_error() {
    local exit_code=$?
    local line_number=$1
    local cmd=$BASH_COMMAND
    echo "[$(date)] ERROR on line $line_number when running $BASH_COMMAND. Got code $exit_code"
}

trap 'log_error $LINENO' ERR

a

scp ./backend/health-app yavidor@raspberry:$REMOTE_EXECUTABLE_PATH

exec_on_ssh "echo $(date) >> ~/health-app/deploy-log.txt"

exec_on_ssh systemctl restart health-app

exec_on_ssh "curl 127.0.0.1:8080" || exit 1
