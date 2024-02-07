import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";
import { createNewEvent } from "../../util/http.js";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import { queryClient } from "../../util/http.js";

export default function NewEvent() {
  const navigate = useNavigate();
  // below the mutate functin when called will be executed to send data to backend
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createNewEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      // it tells react that some of the data in outdated now and it should be makred stale and a refetch shuld be triggered
      //the query key allow a refetch ni all those components  wchi have the quesry  key  events in them
      navigate("/events");
    },
  });

  function handleSubmit(formData) {
    mutate({ event: formData }); // this is how my backend wants the data.
  }

  return (
    <Modal onClose={() => navigate("../")}>
      <EventForm onSubmit={handleSubmit}>
        {isPending && "Submittingg"}
        {!isPending && (
          <>
            <Link to="../" className="button-text">
              Cancel
            </Link>
            <button type="submit" className="button">
              Create
            </button>
          </>
        )}
      </EventForm>
      {isError && (
        <ErrorBlock
          title="failed to create and event"
          message={
            error.info?.message ||
            "Failed to create event, faile to send your input"
          }
        />
      )}
    </Modal>
  );
}
