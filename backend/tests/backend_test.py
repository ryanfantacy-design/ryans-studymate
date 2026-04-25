import os, requests, pytest
BASE = os.environ.get('REACT_APP_BACKEND_URL', 'https://daily-study-4.preview.emergentagent.com').rstrip('/')
A = f"{BASE}/api"
S = requests.Session(); S.headers.update({"Content-Type":"application/json"})

def test_root():
    r = S.get(f"{A}/"); assert r.status_code==200; assert "message" in r.json()

@pytest.fixture(scope="module")
def subj():
    r = S.post(f"{A}/subjects", json={"name":"TEST_Math","color":"#FFD600","target_minutes_daily":90})
    assert r.status_code==200; d=r.json(); assert d["name"]=="TEST_Math"; assert "id" in d
    yield d
    S.delete(f"{A}/subjects/{d['id']}")

def test_list_subjects_no_id_leak(subj):
    r = S.get(f"{A}/subjects"); assert r.status_code==200
    for s in r.json(): assert "_id" not in s

def test_update_subject_propagates(subj):
    sid=subj["id"]
    sess=S.post(f"{A}/sessions", json={"subject_id":sid,"duration_minutes":10,"notes":"TEST"}).json()
    r=S.put(f"{A}/subjects/{sid}", json={"name":"TEST_Math2"}); assert r.status_code==200
    assert r.json()["name"]=="TEST_Math2"
    got=S.get(f"{A}/sessions").json()
    assert any(x["id"]==sess["id"] and x["subject_name"]=="TEST_Math2" for x in got)
    S.delete(f"{A}/sessions/{sess['id']}")

def test_session_crud_and_filter(subj):
    sid=subj["id"]
    r=S.post(f"{A}/sessions", json={"subject_id":sid,"duration_minutes":30,"notes":"TEST_n","date":"2025-01-01"})
    assert r.status_code==200; sess=r.json(); assert sess["subject_name"].startswith("TEST_")
    r=S.get(f"{A}/sessions", params={"date_from":"2025-01-01","date_to":"2025-01-01"})
    assert any(x["id"]==sess["id"] for x in r.json())
    assert S.delete(f"{A}/sessions/{sess['id']}").status_code==200

def test_stats():
    for ep in ["/stats/today","/stats/weekly","/stats/streak"]:
        r=S.get(f"{A}{ep}"); assert r.status_code==200
    assert "total_minutes" in S.get(f"{A}/stats/today").json()
    assert len(S.get(f"{A}/stats/weekly").json()["days"])==7
    sk=S.get(f"{A}/stats/streak").json()
    assert all(k in sk for k in ["current","longest","active_days"])

def test_settings():
    r=S.get(f"{A}/settings"); assert r.status_code==200; orig=r.json()["daily_goal_minutes"]
    r=S.put(f"{A}/settings", json={"daily_goal_minutes":300}); assert r.json()["daily_goal_minutes"]==300
    S.put(f"{A}/settings", json={"daily_goal_minutes":orig})

def test_export_import():
    r=S.get(f"{A}/export"); assert r.status_code==200
    d=r.json(); assert all(k in d for k in ["subjects","sessions","settings"])
    r=S.post(f"{A}/import?replace=false", json={"subjects":[],"sessions":[]}); assert r.status_code==200
