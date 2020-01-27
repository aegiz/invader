"""
This example shows two ways to redirect flows to another server.
Launch with:
$ mitmproxy -s redirect_requests.py
"""
from mitmproxy import http


def request(flow: http.HTTPFlow) -> None:
    # pretty_host takes the "Host" header of the request into account,
    # which is useful in transparent mode where we usually only have the IP
    # otherwise.
    # if flow.request.path.endswith("/api/flash"):
    #if flow.request.pretty_host == "space-invader.com":
    flow.request.url = "http://localhost:3000/upload"