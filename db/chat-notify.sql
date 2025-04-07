-- Create a notification function
CREATE OR REPLACE FUNCTION notify_chat_message_change() 
RETURNS TRIGGER AS $$
DECLARE
  payload TEXT;
BEGIN
  -- Create a JSON payload with relevant information
  payload := json_build_object(
    'timestamp', CURRENT_TIMESTAMP,
    'operation', TG_OP,
    'schema', TG_TABLE_SCHEMA,
    'table', TG_TABLE_NAME,
    'id', NEW.id,
    'data', row_to_json(NEW)
  );
  
  -- Send notification with the payload
  PERFORM pg_notify('message_chat_changes', payload);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger for a specific table (e.g., 'users')
CREATE TRIGGER message_chat_changes_trigger
AFTER INSERT ON message
FOR EACH ROW EXECUTE PROCEDURE notify_chat_messsage_change();
