# Building GitHub actions

We can create our own actions to automate our steps. Public actions require their own dedicated repository. Private actions can be built in our repository. Actions must be written using JavaScript. If we need to write the Action in a different language, we need to run them in Docker containers. They have the benefit of being consistent (since they run in a controlled environment defined in the Docker image), but they have the draw side of being slower (since the image needs to be deployed to the virtual machine).
