module CustomObservable

  def observers
    @observers ||= []
  end
  
  def add_observer(observer)
    observers << observer
  end
  
  def remove_observer(observer)
    observers.delete(observer)
  end
  
  def notify_observers(event, *args)
    results = {}
    puts "DEBUG: Notifying observers for event: #{event}"
    puts "DEBUG: Observers: #{observers.inspect}"
    
    observers.each do |observer|
      puts "DEBUG: Checking observer: #{observer.class.name}"
      puts "DEBUG: Responds to #{event}? #{observer.respond_to?(event)}"
      
      if observer.respond_to?(event)
        puts "DEBUG: Calling #{event} on #{observer}"
        result = observer.public_send(event, *args)
        puts "DEBUG: Result: #{result.inspect}"
        results[observer] = result if result
      end
    end
    
    puts "DEBUG: Final results: #{results.inspect}"
    results
  end
end