#!/bin/sh -l

echo "::debug ::Debug Message"
echo "::warning ::Warning Message"
echo "::error ::Error Message"

echo "::add-mask::$1"

time = $(date)

echo "::set-output name=time::$time"

echo "::group::Some expendable logs"
echo "some stuff"
echo "some stuff"
echo "some stuff"
echo "some stuff"
echo "::endgroup::"

echo "::set-env name=HELLO::hello"
